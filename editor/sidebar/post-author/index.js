/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { flowRight } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelRow, withAPIData, withInstanceId } from '@wordpress/components';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { getEditedPostAttribute } from '../../selectors';
import { editPost } from '../../actions';

class PostAuthor extends Component {
	render() {
		const { users, onUpdateAuthor, postAuthor, instanceId } = this.props;
		if ( ! users.data || users.data.length < 2 ) {
			return null;
		}

		const selectId = 'post-author-selector-' + instanceId;

		// Disable reason: A select with an onchange throws a warning

		/* eslint-disable jsx-a11y/no-onchange */
		return (
			<PanelRow>
				<label htmlFor={ selectId }>{ __( 'Author' ) }</label>
				<select
					id={ selectId }
					value={ postAuthor }
					onChange={ ( event ) => onUpdateAuthor( event.target.value ) }
					className="editor-post-author__select"
				>
					{ users.data.map( ( author ) => (
						<option key={ author.id } value={ author.id }>{ author.name }</option>
					) ) }
				</select>
			</PanelRow>
		);
		/* eslint-enable jsx-a11y/no-onchange */
	}
}

export default flowRight( [
	connect(
		( state ) => {
			return {
				postAuthor: getEditedPostAttribute( state, 'author' ),
			};
		},
		{
			onUpdateAuthor( author ) {
				return editPost( { author } );
			},
		},
	),
	withAPIData( () => {
		return {
			users: '/wp/v2/users?context=edit&per_page=100',
		};
	} ),
	withInstanceId,
] )( PostAuthor );
