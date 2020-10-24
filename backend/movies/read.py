import json
import boto3


def handler(event, context):
    id = str(event['pathParameters']['id'])
    key = {
        'code': id,
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('MoviesTable')
    
    result = table.get_item(Key=key)
    item = result.get('Item', {})
    
    body = {
        "message": "read",
        "item": item
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