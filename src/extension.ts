// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import change, { validCases } from './change-case';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "change-case" is now active!');

	interface Store {
		currentStatus: number;
		enabledStatus: string[];
	}

	const store: Store = {
		// The current case status index
		currentStatus: 0,
		// The enabled status string list
		enabledStatus: []
	};

	const keyCodePattern = /^\d+$/;

	let setKeyCodeDisposable = vscode.commands.registerCommand('extension.setKeyCode', () => {
		vscode.window.showInputBox({
			placeHolder: 'example: 012',
			prompt: '0 = camelCase, 1 = PascalCase, 2 = CONSTANT_CASE, 3 = snake_case, 4 = kebab-case',
			validateInput: text => {
				if (!keyCodePattern.test(text)) {
					return 'The key code should consist only numbers';
				}
				return '';
			}
		}).then(keyCode => {
			if (!keyCode) {
				return;
			}
			const codes = keyCode.split('');
			const indexes = codes.map(code => parseInt(code));
			const newStatusList = indexes.map(index => validCases[index]);
			store.enabledStatus = newStatusList;
		});
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let changeCaseDisposable = vscode.commands.registerTextEditorCommand('extension.changeCase', (textEditor, edit) => {

		// change all the selections
		textEditor.selections.forEach(selection => {
			const originText = textEditor.document.getText(selection);
			const newText = change(originText, store.enabledStatus[store.currentStatus]);
			edit.replace(selection, newText);
		});

		// switch to next status
		store.currentStatus = (store.currentStatus + 1 ) % store.enabledStatus.length;
	});

	context.subscriptions.push(setKeyCodeDisposable);
	context.subscriptions.push(changeCaseDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
