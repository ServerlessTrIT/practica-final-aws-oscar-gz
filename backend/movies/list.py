import json
import boto3


def handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('MoviesTable')
    
    result = table.scan()
    items = result.get('Items', [])
    
    body = {
        "message": "list",
        "items": items
    }

    response = {
        "statusCode": result['ResponseMetadata']['HTTPStatusCode'], #200
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET'
        },
        "body": json.dumps(body)
    }

    return response