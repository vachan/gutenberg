/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { __ } from 'i18n';
import { IconButton } from 'components';

/**
 * Internal dependencies
 */
import './style.scss';

function BlockSettingsMenu( { onDelete, selectBlock } ) {
	const toggleInspector = () => {
		selectBlock();
		// TODO: onToggleBlockInspector
	};

	return (
		<div className="editor-block-settings-menu">
			<IconButton
				className="editor-block-settings-menu__control"
				onClick={ toggleInspector }
				icon="admin-generic"
				label={ __( 'Show inspector' ) }
			/>
			<IconButton
				className="editor-block-settings-menu__control"
				onClick={ onDelete }
				icon="trash"
				label={ __( 'Delete the block' ) }
			/>
		</div>
	);
}

export default connect(
	undefined,
	( dispatch, ownProps ) => ( {
		onDelete() {
			dispatch( {
				type: 'REMOVE_BLOCKS',
				uids: [ ownProps.uid ],
			} );
		},
		selectBlock() {
			dispatch( {
				type: 'TOGGLE_BLOCK_SELECTED',
				selected: true,
				uid: ownProps.uid,
			} );
		},
	} ),
	undefined,
	{
		storeKey: 'editor',
	}
)( BlockSettingsMenu );