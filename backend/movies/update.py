import json
import boto3


def handler(event, context):
    
    # Obtener el id del elemento a editar
    id = str(event['pathParameters']['id'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('MoviesTable')

    movie = json.loads(event['body'])
    item = {
        'code': id,
        'title': movie['title'],
        'genre': movie['genre'],
    }
    result = table.put_item(Item=item)

    body = {
        "message": "update",
        "input": movie
    }

    response = {
        "statusCode": result['ResponseMetadata']['HTTPStatusCode'], #200
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        },
        "body": json.dumps(body)
    }

    return response