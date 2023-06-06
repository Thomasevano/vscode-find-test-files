import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.findTestFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const filePath = editor.document.uri.fsPath;
    const fileName = path.basename(filePath, '.js');
    const testFileName = `${fileName}_test.js`;
    const projectRootPath = path.basename(path.dirname(path.dirname(path.dirname(filePath))));
    const testFolderPath = path.join(projectRootPath, 'tests', '**', path.basename(path.dirname(filePath)));
    const testFilePath = path.join(testFolderPath, testFileName);
    const files = await vscode.workspace.findFiles(testFilePath, '**/node_modules/**');
    console.log('files', files);

    // fs.access(testFilePath, fs.constants.F_OK, (err) => {
    //   if (!err) {
    //     vscode.workspace.openTextDocument(testFilePath).then((document) => {
    //       vscode.window.showTextDocument(document);
    //     });
    //   }
    // });
  });

  context.subscriptions.push(disposable);
}