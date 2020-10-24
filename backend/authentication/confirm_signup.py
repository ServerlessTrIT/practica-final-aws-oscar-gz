import json
import boto3
import os


def handler(event, context):
    code = 200
    body = {}
    clientId = os.environ['CLIENT_ID']

    if event['body'] is None:
        code = 400
    else:
        activator = json.loads(event['body'])
        code_account = activator.get('code', '')
        email = activator.get('username', '')

        client = boto3.client('cognito-idp')

        try:
            result = client.confirm_sign_up(ClientId=clientId, Username=email, ConfirmationCode=code_account)
            body = {
                "message": "Cuenta activada con éxito"
            }
        except Exception as e:
            code = 400
            body = {
                "message": e.args[0]
            }

    response = {
        "statusCode": code,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        "body": json.dumps(body)
    }

    return response