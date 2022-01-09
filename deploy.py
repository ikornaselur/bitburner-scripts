import requests
import json
import base64
import os

URL = "http://localhost:9990/"
VALID_EXTENSIONS = [".js", ".script", ".ns", ".txt"]


class DeployError(Exception):
    pass


def deploy(file: str) -> None:
    deployed_file = file[4:]
    print(f"Deploying '{file}' -> '{deployed_file}'")

    with open(file, "rb") as f:
        content = f.read()

    payload = {
        "filename": deployed_file,
        "code": base64.b64encode(content).decode("utf-8"),
    }
    json_payload = json.dumps(payload)

    resp = requests.post(
        URL,
        data=json_payload,
        headers={
            "Content-Type": "application/json",
            "Content-Length": str(len(json_payload)),
            "Authorization": f"Bearer {os.environ['API_TOKEN']}",
        },
    )

    resp.raise_for_status()
    if resp.text != "written":
        raise DeployError(resp.text)


def main() -> None:
    for path, _, files in os.walk("dist"):
        for file in files:
            if any(file.endswith(ext) for ext in VALID_EXTENSIONS):
                deploy(f"{path}/{file}")


if __name__ == "__main__":
    main()
