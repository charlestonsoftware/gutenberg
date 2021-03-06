/**
 * External Dependencies
 */
import { connect } from 'react-redux';
import { reduce, get, find, flow } from 'lodash';

/**
 * WordPress dependencies
 */
import { DropZone, withContext } from '@wordpress/components';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { insertBlocks } from '../../actions';

function BlockDropZone( { index, isLocked, ...props } ) {
	if ( isLocked ) {
		return null;
	}

	const dropFiles = ( files, position ) => {
		const transformation = reduce( getBlockTypes(), ( ret, blockType ) => {
			if ( ret ) {
				return ret;
			}

			return find( get( blockType, 'transforms.from', [] ), ( transform ) => (
				transform.type === 'files' && transform.isMatch( files )
			) );
		}, false );

		if ( transformation ) {
			let insertPosition;
			if ( index !== undefined ) {
				insertPosition = position.y === 'top' ? index : index + 1;
			}
			transformation.transform( files ).then( ( blocks ) => {
				props.insertBlocks( blocks, insertPosition );
			} );
		}
	};

	return (
		<DropZone
			onFilesDrop={ dropFiles }
		/>
	);
}

export default flow(
	connect(
		undefined,
		{ insertBlocks }
	),
	withContext( 'editor' )( ( settings ) => {
		const { templateLock } = settings;

		return {
			isLocked: !! templateLock,
		};
	} )
)( BlockDropZone );
