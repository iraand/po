import React from 'react';
import { Select } from 'antd';

class ExtendedSelect extends React.Component {
  state = { value: [] };

  handleChange = (value) => {
    let actual_value = value;

    if (value.includes('all')) {
      actual_value = this.props.extension.all_values
    }

    this.setState({ value: actual_value });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(actual_value);
    }
  };

  render() {
    const props_clone = Object.assign({}, this.props);

    delete props_clone.extension;

    return (
      <Select
        {...props_clone}
        onChange={this.handleChange}
        value={this.state.value}
        // style={{ maxHeight: 100, overflow: 'auto' }}
      >
        {this.props.children}
      </Select>
    );
  }
}

export default ExtendedSelect;