import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { parseIdentifierToWordArray } from '../../change-case';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('[parseIdentifierToWordArray]', () => {
        assert.deepStrictEqual(parseIdentifierToWordArray('camelCase'), ['camel', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('PascalCase'), ['pascal', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('CONSTANT_CASE'), ['constant', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('snake_case'), ['snake', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('kebab-case'), ['kebab', 'case']);
        assert.deepStrictEqual(parseIdentifierToWordArray('AwsS3BucketName'), ['aws', 's3', 'bucket', 'name']);
        assert.deepStrictEqual(parseIdentifierToWordArray('AWS_S3_BUCKET_NAME'), ['aws', 's3', 'bucket', 'name']);
	});
});
