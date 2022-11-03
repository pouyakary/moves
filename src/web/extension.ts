import * as vscode  from 'vscode';
import * as actions from './actions';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function registerCommandHandler(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	registerCommandHandler('pillar.moveCursorUnderNextColumnAbove',
		actions.cursorUnderNextColumnAbove);
	registerCommandHandler('pillar.moveCursorUnderNextColumnBelow',
		actions.cursorUnderNextColumnBelow);

	registerCommandHandler('pillar.moveCursorUnderPreviousColumnAbove',
		actions.cursorUnderPreviousColumnAbove);
	registerCommandHandler('pillar.moveCursorUnderPreviousColumnBelow',
		actions.cursorUnderPreviousColumnBelow);

	registerCommandHandler('pillar.selectAllWordNeighborLines',
		actions.addCursorToAllNeighborLines);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
