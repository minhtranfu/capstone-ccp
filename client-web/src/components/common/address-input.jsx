import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import PropTypes from 'prop-types';

export class AddressInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: props.address || ''
    };
  }

  /**
   * Handle user input to address field
   */
  _handleChangeAddress = address => {
    const { onChange } = this.props;

    this.setState({ address }, () => {
      onChange && onChange(address);
    });
  };

  /**
   * Handle user select address from auto complete
   */
  _handleSelectAddress = address => {
    const { onSelect } = this.props;

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {

        const newState = {
          address,
          latitude: latLng.lat,
          longitude: latLng.lng,
        };

        this.setState(newState, () => {
          onSelect && onSelect(newState);
        });
      })
      .catch(error => console.error('Error', error));
  };

  /**
   * Get current long, lat for submit hiring request
   */
  _handleSelectCurrentLocation = () => {
    if (!window.navigator || !window.navigator.geolocation) {
      return false;
    }

    const { onSelect } = this.props;

    const location = window.navigator.geolocation;
    location.getCurrentPosition(result => {
      const { coords } = result;
      const { latitude, longitude } = coords;
      const newState = {
        address: 'Current location',
        latitude,
        longitude,
      };

      this.setState(newState, () => {
        onSelect && onSelect(newState);
      });
    },
    () => {
      window.alert('Can not get your location, please allow!');
    });
  };

  render() {
    const { address, isFocus } = this.state;
    const { wrapperProps, inputProps } = this.props;

    return (
      <PlacesAutocomplete
        value={address}
        onChange={this._handleChangeAddress}
        onSelect={this._handleSelectAddress}
        searchOptions={{
          componentRestrictions: {
            country: 'VN'
          }
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          const componentInputProps = getInputProps({
            placeholder: 'Search Places ...',
            className: 'form-control location-search-input',
          });

          if (inputProps.onBlur) {
            const customOnBlur = inputProps.onBlur;
            inputProps.onBlur = e => {
              customOnBlur(e);
              componentInputProps.onBlur(e);
            };
          }

          return (
            <div {...wrapperProps} onFocus={() => this.setState({isFocus: true})} onBlur={() => this.setState({isFocus: false})}>
              <input
                {...componentInputProps}
                {...inputProps}
              />
              {(isFocus && !address && !loading && suggestions.length === 0) &&
                <div className="autocomplete-dropdown-container shadow-lg border bg-white">
                  <div className="suggestion-item" onMouseDown={this._handleSelectCurrentLocation} onTouchStart={this._handleSelectCurrentLocation} role="option">
                    <i className="fas fa-map-marker text-primary"></i> Use your current location
                  </div>
                </div>
              }
              {(loading || suggestions.length > 0) &&
                <div className="autocomplete-dropdown-container shadow-lg border bg-white">
                  {loading &&
                    <div className="suggestion-item">
                      <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> Loading...
                    </div>
                  }
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item active'
                      : 'suggestion-item';

                    const suggestionProps = getSuggestionItemProps(suggestion, {
                      className
                    });

                    return (
                      <div
                        {...suggestionProps}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          )
        }}
      </PlacesAutocomplete>
    );
  }
}

AddressInput.props = {
  wrapperProps: PropTypes.object,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func
};

AddressInput.defaultProps = {
  wrapperProps: {},
  inputProps: {}
};

export default AddressInput;
