import React, {PureComponent} from "react";

class Footer extends PureComponent {


    render() {
        const footerStyle = {
            height: '100px',
            textAlign: 'center',
        };

        return (
            <div className='wowza-footer' style={footerStyle}>
                <h1>wowza footer</h1>
            </div>
        )
    }

}

export default Footer;
