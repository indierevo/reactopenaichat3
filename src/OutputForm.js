import React from 'react';

class OutputForm extends React.Component {
  render() {
    // 'data' is being extracted from the props passed to this component
    const { data } = this.props;
    // Replace newline characters in 'data' with '<br>' HTML tags for line breaks
    const contentWithLineBreaks = data.replace(/\n/g, '<br>');
    // Return the formatted data (messages) within a label element
    return <label style={{ width: 650, paddingTop: 10, paddingBottom: 20 }} dangerouslySetInnerHTML={{ __html: contentWithLineBreaks }} />;
  }
}

export default OutputForm;