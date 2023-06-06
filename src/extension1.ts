import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function findTestsFolder(currentFileDir: string): string | null {
  let currentDir = currentFileDir;
  while (true) {
      const testsDir = path.join(currentDir, 'tests');
      if (fs.existsSync(testsDir) && fs.statSync(testsDir).isDirectory()) {
          return testsDir;
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
          break;
      }
      currentDir = parentDir;
  }
  return null;
}

function getParentFolder(currentFilePath: string): string {
  const parentFolderPath = path.dirname(currentFilePath);
  const parentFolderName = path.basename(parentFolderPath);
  return parentFolderName;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('go-to-test.findTestFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const currentFilePath = editor.document.fileName;
        const currentFileName = path.basename(currentFilePath, path.extname(currentFilePath));
        // console.log('currentFileName', currentFileName);
        const currentFileDir = path.dirname(currentFilePath);
        // console.log('currentFileDir', currentFileDir);

        const testsFolderPath = findTestsFolder(currentFileDir);
        if (!testsFolderPath) {
            vscode.window.showInformationMessage('No "tests" folder found.');
            return;
        }
        
        const parentFolder = getParentFolder(currentFilePath);
        
        // const folderToSearch = testsFolderPath + '/**/' + parentFolder + '/';
        const folderToSearch = path.join(testsFolderPath, '**', parentFolder);
        
        console.log('folderToSearch', folderToSearch);
        const files = await vscode.workspace.findFiles(new vscode.RelativePattern(folderToSearch, '*_test.js'), '**/node_modules/**');
        // const files = await vscode.workspace.findFiles(new vscode.RelativePattern(testsFolderPath, '/**/*_test.js'), '**/node_modules/**');
        console.log('files', files);
        const testFiles = files.filter(file => {
            const fileName = path.basename(file.fsPath, '_test.js');
            return fileName === currentFileName;
        });

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

export function deactivate() {}
