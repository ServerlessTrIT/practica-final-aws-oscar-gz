import json
import boto3


def handler(event, context):
    movie = json.loads(event['body'])
    item = {
        'code': movie['code'], #Código identificador de la película
        'title': movie['title'], # Titulo película
        'genre': movie['genre'] # Género película
    }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('MoviesTable')
    result = table.put_item(Item=item)

    body = {
        "message": "create",
        "input": movie
    }

    response = {
        "statusCode": result['ResponseMetadata']['HTTPStatusCode'], #200
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, PUT'
        },
        "body": json.dumps(body)
    }

    return response