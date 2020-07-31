import React from 'react'
import { Result, Button } from 'antd'
import { useHistory } from 'react-router-dom'

function AreYouLost() {
    const history = useHistory();

    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
            />
        </div>
    )
}

export default AreYouLost
