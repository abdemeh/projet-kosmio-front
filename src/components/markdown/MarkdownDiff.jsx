import React, { useState } from 'react';
// CORRECTION ICI : on retire le "-next"
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

const MarkdownDiff = ({ oldCode, newCode, leftTitle = "Original", rightTitle = "Modifié" }) => {
    const [useSplitView, setUseSplitView] = useState(true);

    // Le reste du code est identique...
    const styles = {
        variables: {
            light: {
                diffViewerBackground: '#fff',
                diffViewerTitleBackground: '#f3f4f6',
                gutterBackground: '#f9fafb',
                addedBackground: '#dcfce7',
                addedColor: '#166534',
                removedBackground: '#fee2e2',
                removedColor: '#991b1b',
            }
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Comparaison des versions</h3>
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useSplitView}
                        onChange={() => setUseSplitView(!useSplitView)}
                        className="mr-2"
                    />
                    Vue séparée (Split View)
                </label>
            </div>

            <div className="max-h-[600px] overflow-y-auto font-mono text-sm">
                <ReactDiffViewer
                    oldValue={oldCode}
                    newValue={newCode}
                    splitView={useSplitView}
                    compareMethod={DiffMethod.WORDS}
                    styles={styles}
                    leftTitle={leftTitle}
                    rightTitle={rightTitle}
                />
            </div>
        </div>
    );
};

export default MarkdownDiff;