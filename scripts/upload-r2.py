"""Upload the approved manifest only. Default invocation performs a local dry run."""
import argparse
import hashlib
import json
import mimetypes
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
BUDGET = 10_000_000_000
BUCKET = "vianna-portfolio-media"
ENDPOINT = "https://645c2f26259019a7d0cd8ad5008d7db0.r2.cloudflarestorage.com"


def projected_bytes(expected, existing, other_bytes):
    if other_bytes < 0:
        raise ValueError("Other storage must be explicitly verified")
    unknown = set(existing) - set(expected)
    if unknown:
        raise ValueError(f"Unexpected remote objects. Upload stopped: {sorted(unknown)[:3]}")
    for key, size in existing.items():
        if size != expected[key]:
            raise ValueError(f"Existing object differs. No overwrite allowed: {key}")
    total = other_bytes + sum(existing.values()) + sum(size for key, size in expected.items() if key not in existing)
    if total >= BUDGET:
        raise ValueError(f"Upload stopped: projected storage {total} reaches 10 GB")
    return total


def local_manifest():
    manifest = json.loads((ROOT / "deploy/media-manifest.json").read_text(encoding="utf-8"))
    expected = {}
    public = (ROOT / "public").resolve()
    for item in manifest["files"]:
        key, size = item["key"], item["bytes"]
        source = (public / key).resolve()
        if not key.startswith("media/") or not source.is_relative_to(public / "media") or key in expected:
            raise ValueError(f"Invalid manifest key: {key}")
        if not isinstance(size, int) or size <= 0 or source.stat().st_size != size:
            raise ValueError(f"Local file changed: {key}")
        expected[key] = size
    if sum(expected.values()) != manifest["totalBytes"]:
        raise ValueError("Manifest total is stale")
    actual = {p.relative_to(public).as_posix() for p in (public / "media").rglob("*") if p.is_file()}
    if actual != set(expected):
        raise ValueError("Public media differs from the approved manifest")
    projected_bytes(expected, {}, 0)
    return expected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--upload", action="store_true")
    parser.add_argument("--other-storage-bytes", type=int, help="Freshly verified storage outside this bucket, including incomplete uploads")
    args = parser.parse_args()
    expected = local_manifest()
    print(f"Approved: {len(expected)} files, {sum(expected.values())} bytes, {BUDGET - sum(expected.values())} bytes below 10 GB.", flush=True)
    if not args.upload:
        print("Dry run only. No credentials used and no files uploaded.")
        return
    if args.other_storage_bytes is None:
        parser.error("Verify the account's other storage before passing --other-storage-bytes")
    sys.path.insert(0, str(ROOT / ".tools/r2-python"))
    import boto3
    from boto3.s3.transfer import TransferConfig
    from botocore.config import Config
    client = boto3.client("s3", endpoint_url=ENDPOINT, region_name="auto",
                          aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
                          aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
                          config=Config(retries={"max_attempts": 3, "mode": "standard"}))
    transfer = TransferConfig(multipart_threshold=64 * 1024**2, multipart_chunksize=16 * 1024**2, use_threads=False)

    def inventory():
        if client.list_multipart_uploads(Bucket=BUCKET, MaxUploads=1).get("Uploads"):
            raise ValueError("Incomplete remote upload found. Stop and inspect it before sending more data.")
        result = {}
        for page in client.get_paginator("list_objects_v2").paginate(Bucket=BUCKET):
            result.update({item["Key"]: item["Size"] for item in page.get("Contents", [])})
        projected_bytes(expected, result, args.other_storage_bytes)
        return result

    for index, (key, size) in enumerate(expected.items(), 1):
        remote = inventory()
        source = ROOT / "public" / key
        with source.open("rb") as file:
            digest = hashlib.file_digest(file, "sha256").hexdigest()
        if key in remote:
            head = client.head_object(Bucket=BUCKET, Key=key)
            if head.get("Metadata", {}).get("sha256") != digest:
                raise ValueError(f"Existing remote content is unverified. No overwrite allowed: {key}")
        else:
            # All missing files are reserved by inventory(), not just this file.
            # Sequential transfer prevents two concurrent copies of the same object.
            print(f"Uploading {index}/{len(expected)}: {key} ({size} bytes)", flush=True)
            client.upload_file(str(source), BUCKET, key, Config=transfer, ExtraArgs={
                "ContentType": mimetypes.guess_type(key)[0] or "application/octet-stream",
                "CacheControl": "public, max-age=86400", "Metadata": {"sha256": digest}, "StorageClass": "STANDARD"})
            head = client.head_object(Bucket=BUCKET, Key=key)
            if head["ContentLength"] != size or head.get("Metadata", {}).get("sha256") != digest:
                raise ValueError(f"Remote verification failed: {key}")
    final = inventory()
    if final != expected:
        raise ValueError("Remote manifest is incomplete")
    print(f"Verified upload: {len(final)} objects, {sum(final.values())} bytes. No duplicates or incomplete uploads.", flush=True)


if __name__ == "__main__":
    main()
