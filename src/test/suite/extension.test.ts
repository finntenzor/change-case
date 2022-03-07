import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { TYPE_CAMEL_LIKE, TYPE_SNAKE_LIKE, mainTypeRecognize } from '../../change-case';
import { parseIdentifierToWordArray } from '../../change-case';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('[mainTypeRecognize]', () => {
        assert.deepStrictEqual(mainTypeRecognize('camelCase'),TYPE_CAMEL_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('PascalCase'), TYPE_CAMEL_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('CONSTANT_CASE'), TYPE_SNAKE_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('snake_case'), TYPE_SNAKE_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('kebab-case'), TYPE_SNAKE_LIKE);

        assert.deepStrictEqual(mainTypeRecognize('AwsS3BucketName'), TYPE_CAMEL_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('AWS_S3_BUCKET_NAME'), TYPE_SNAKE_LIKE);

        assert.deepStrictEqual(mainTypeRecognize('openAReview'), TYPE_CAMEL_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('OpenAReview'), TYPE_CAMEL_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('OPEN_A_REVIEW'), TYPE_SNAKE_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('open_a_review'), TYPE_SNAKE_LIKE);
        assert.deepStrictEqual(mainTypeRecognize('open-a-review'), TYPE_SNAKE_LIKE);
	});

	test('[parseIdentifierToWordArray]', () => {
        assert.deepStrictEqual(parseIdentifierToWordArray('camelCase'), ['camel', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('PascalCase'), ['pascal', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('CONSTANT_CASE'), ['constant', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('snake_case'), ['snake', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('kebab-case'), ['kebab', 'case']);

        assert.deepStrictEqual(parseIdentifierToWordArray('AwsS3BucketName'), ['aws', 's3', 'bucket', 'name']);
        assert.deepStrictEqual(parseIdentifierToWordArray('AWS_S3_BUCKET_NAME'), ['aws', 's3', 'bucket', 'name']);

        assert.deepStrictEqual(parseIdentifierToWordArray('openAReview'), ['open', 'a', 'review']);
        assert.deepStrictEqual(parseIdentifierToWordArray('OpenAReview'), ['open', 'a', 'review']);
        assert.deepStrictEqual(parseIdentifierToWordArray('OPEN_A_REVIEW'), ['open', 'a', 'review']);
        assert.deepStrictEqual(parseIdentifierToWordArray('open_a_review'), ['open', 'a', 'review']);
        assert.deepStrictEqual(parseIdentifierToWordArray('open-a-review'), ['open', 'a', 'review']);
    });
});
