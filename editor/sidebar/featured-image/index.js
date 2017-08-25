/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, PanelBody, Spinner, ResponsiveWrapper } from '@wordpress/components';
import { MediaUploadButton } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import { getEditedPostAttribute, isEditorSidebarPanelOpened } from '../../selectors';
import { editPost, toggleSidebarPanel } from '../../actions';

/**
 * Module Constants
 */
const PANEL_NAME = 'featured-image';

class FeaturedImage extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			media: null,
			loading: false,
		};
		this.onToggle = this.onToggle.bind( this );
	}

	componentDidMount() {
		this.fetchMedia();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.featuredImageId !== this.props.featuredImageId ) {
			this.fetchMedia();
		}
	}

	componentWillUnmount() {
		if ( this.fetchMediaRequest ) {
			this.fetchMediaRequest.abort();
		}
	}

	fetchMedia() {
		this.setState( { media: null } );
		if ( ! this.props.featuredImageId ) {
			this.setState( { loading: false } );
			return;
		}
		this.setState( { loading: true } );
		if ( this.fetchMediaRequest ) {
			this.fetchMediaRequest.abort();
		}
		this.fetchMediaRequest = new wp.api.models.Media( { id: this.props.featuredImageId } ).fetch()
			.done( ( media ) => {
				this.setState( {
					loading: false,
					media,
				} );
			} )
			.fail( ( xhr ) => {
				if ( xhr.statusText === 'abort' ) {
					return;
				}
				this.setState( {
					loading: false,
				} );
			} );
	}

	onToggle() {
		this.props.toggleSidebarPanel( PANEL_NAME );
	}

	render() {
		const { featuredImageId, onUpdateImage, onRemoveImage, isOpened } = this.props;
		const { media, loading } = this.state;

		return (
			<PanelBody title={ __( 'Featured image' ) } opened={ isOpened } onToggle={ this.onToggle }>
				<div className="editor-featured-image__content">
					{ !! featuredImageId &&
						<MediaUploadButton
							buttonProps={ { className: 'button-link editor-featured-image__preview' } }
							onSelect={ onUpdateImage }
							type="image"
						>
							{ media &&
								<ResponsiveWrapper
									naturalWidth={ media.media_details.width }
									naturalHeight={ media.media_details.height }
								>
									<img src={ media.source_url } alt={ __( 'Featured image' ) } />
								</ResponsiveWrapper>
							}
							{ loading && <Spinner /> }
						</MediaUploadButton>
					}
					{ !! featuredImageId && media &&
						<p className="editor-featured-image__howto">
							{ __( 'Click the image to edit or update' ) }
						</p>
					}
					{ ! featuredImageId &&
						<MediaUploadButton
							buttonProps={ { className: 'editor-featured-image__toggle button-link' } }
							onSelect={ onUpdateImage }
							type="image"
						>
							{ __( 'Set featured image' ) }
						</MediaUploadButton>
					}
					{ !! featuredImageId &&
						<Button className="editor-featured-image__toggle button-link" onClick={ onRemoveImage }>
							{ __( 'Remove featured image' ) }
						</Button>
					}
				</div>
			</PanelBody>
		);
	}
}

export default connect(
	( state ) => {
		return {
			featuredImageId: getEditedPostAttribute( state, 'featured_media' ),
			isOpened: isEditorSidebarPanelOpened( state, PANEL_NAME ),
		};
	},
	{
		onUpdateImage( image ) {
			return editPost( { featured_media: image.id } );
		},
		onRemoveImage() {
			return editPost( { featured_media: null } );
		},
		toggleSidebarPanel,
	}
)( FeaturedImage );
