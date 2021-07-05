// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import change, { validCases } from './change-case';

export interface Store {
	currentStatus: number;
	enabledStatus: string[];
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const store: Store = {
		// The current case status index
		currentStatus: 0,
		// The enabled status string list
		enabledStatus: ['CamelCase', 'PascalCase', 'ConstantCase']
	};

	const keyCodePattern = /^\d+$/;

	let setKeyCodeDisposable = vscode.commands.registerCommand('change-case.setKeyCode', () => {
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
	let changeCaseDisposable = vscode.commands.registerTextEditorCommand('change-case.changeCase', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {

        // change all the selections
		textEditor.selections.forEach(selection => {
			const originText = textEditor.document.getText(selection);
			const newText = change(originText, store.enabledStatus[store.currentStatus]);
			edit.replace(selection, newText);
		});

        // change case of current word if no selection
        if (textEditor.selection.isEmpty) {
            const currentCursorPosition: vscode.Position = textEditor.selection.start;
            const currentWordRange = textEditor.document.getWordRangeAtPosition(currentCursorPosition);
            if (currentWordRange) {
                const originText = textEditor.document.getText(currentWordRange);
                const newText = change(originText, store.enabledStatus[store.currentStatus]);

                // 虽然不知道为什么 但是直接调用replace没反应
                // I don't know why this line of code doesn't work. :(
                // edit.replace(currentWordRange, newText);

                // change the case of current word
                textEditor.edit(builder => {
                    builder.replace(currentWordRange, newText);
                });
            }
        }

        // switch to next status
        store.currentStatus = (store.currentStatus + 1 ) % store.enabledStatus.length;
	});

	context.subscriptions.push(setKeyCodeDisposable);
	context.subscriptions.push(changeCaseDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
