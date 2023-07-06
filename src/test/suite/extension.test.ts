import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getProjectRootFolder } from '../../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');
  
  test('getProjectRootFolder', async () => {
    console.log('directoryName', __dirname);
    
    // given
    const filePath = 'exampleProject/api/lib/infrastructure/user.js';
    
    // when
    const projectRootPath = getProjectRootFolder(filePath);
    
    // then
    assert.strictEqual(projectRootPath, 'api');
  });

  // test('find the corresponding test file', () => {
  //   // given
  //   const currentFile = '';
  //   assert.strictEqual(-1, [1, 2, 3].indexOf(5));
  //   assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  // });
});
