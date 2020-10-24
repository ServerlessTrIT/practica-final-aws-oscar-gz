import json
import boto3


def handler(event, context):
    movie = json.loads(event['body'])
    
    key = {
        'code': movie['code'],
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('MoviesTable')
    result = table.delete_item(Key=key)

    body = {
        "message": "delete",
        "input": movie
    }

    response = {
        "statusCode": result['ResponseMetadata']['HTTPStatusCode'], #200
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, DELETE'
        },
        "body": json.dumps(body)
    }

    return response