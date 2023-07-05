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
    
    const projectRootPath = getProjectRootFolder(filePath);
    const fileParentFolderName = path.basename(path.dirname(filePath));
    
    const testFolderPath = path.join(projectRootPath, 'tests', '**', fileParentFolderName);
    const testFilePath = path.join(testFolderPath, testFileName);
    
    const testFiles = await vscode.workspace.findFiles(testFilePath, '**/node_modules/**');
      console.log('files', testFiles);

    // fs.access(testFilePath, fs.constants.F_OK, (err) => {
    //   if (!err) {
    //     vscode.workspace.openTextDocument(testFilePath).then((document) => {
    //       vscode.window.showTextDocument(document);
    //     });
    //   }
    // });
    
    if (testFiles.length === 0) {
      vscode.window.showInformationMessage('No matching test files found.');
      return;
    }

    const quickPickItems = testFiles.map(file => ({
        label: path.basename(file.fsPath),
        description: vscode.workspace.asRelativePath(file.fsPath),
        filePath: file.fsPath
    }));

    const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select a test file to open'
    });

    if (selectedItem) {
        const document = await vscode.workspace.openTextDocument(selectedItem.filePath);
        await vscode.window.showTextDocument(document);
    }
  });
  
  context.subscriptions.push(disposable);
}

export function getProjectRootFolder(filePath: string): string {
  const pathParts = filePath.split(path.sep);
  if (!vscode.workspace.workspaceFolders) {
    return 'no workspace folder';
  }
  const workspaceFolder = path.basename(vscode.workspace.workspaceFolders[0].uri.path);
  const projectRootFolderIndex = pathParts.slice(0, pathParts.indexOf(workspaceFolder) + 1);
  const projectRootFolder = pathParts[projectRootFolderIndex.length];
  return projectRootFolder;
}
