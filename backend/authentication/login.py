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
        user = json.loads(event['body'])
        email = user.get('username', '')
        password = user.get('password', '')

        client = boto3.client('cognito-idp')
        
        # Datos del login
        user_data = {
            'USERNAME': email,
            'PASSWORD': password
        }
        
        try:
            result = client.initiate_auth(AuthFlow='USER_PASSWORD_AUTH', AuthParameters=user_data, ClientId=clientId)
            body = {
                "token": result['AuthenticationResult']['IdToken']
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