import React, {PureComponent} from "react";

class PageHeader extends PureComponent {


    render() {
        const headerStyle = {
            height: '80px',
            textAlign: 'center',
            background: '#002140',
            minWidth: '1400px',
        };

        const h1Style = {
            color: '#ffffff',
        };


        return (
            <div className='wowza-header' style={headerStyle}>
                <h1 style={h1Style}>Wowza Streaming Engine 测试demo</h1>
            </div>
        )
    }

}

export default PageHeader;
