var Child = React.createClass({displayName: "Child",
  render: function(){
    return (
      React.createElement("div", null, 
        "and this is the ", React.createElement("b", null, this.props.name), "."
      )
    )
  }
});
