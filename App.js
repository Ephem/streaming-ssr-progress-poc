import React from 'react';

const AdvanceProgress = ({ progress }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: `
<script>setProgress(${progress});</script>
        ` }} />
    );
};

const Item = ({ bacon }) => {
    return (
        <div style={{ marginBottom: '10px' }}>
            <img style={{ float: 'left', marginRight: '10px' }} src="https://picsum.photos/200/?image=10" />
            <span>{[...bacon].map((c, i) => <span key={i}>{c}</span>)}</span>
            <div style={{ clear: 'both' }} />
        </div>
    );
};

const Info = () => {
    return (
        <div style={{ border: "1px solid", padding: "10px" }}>
            <strong>Info</strong>
            <p>
                This is a quickly thrown together demo of a loading
                indicator that is fed its progress state from the server
                through script tags in the streaming html. Both bars
                represents processes that are happening on the server side.
            </p>
            <p>
                The green bar represents the server loading data from an
                external API before being able to render the underlying
                React-application.
            </p>
            <p>
                The red bar represents how far along the React rendering
                process has come on the server.
            </p>
            <p style={{ marginBottom: "0" }}>
                Inspired by <a href="https://twitter.com/acdlite">@acdlite</a>'s talk about streaming SSR at Zeit day. Tweet me: <a href="https://twitter.com/EphemeralCircle">@EphemeralCircle</a>
            </p>
        </div>
    );
}

export default ({ bacon }) => {
    let arr = [];
    for (let i = 0; i < 200; i += 1) {
        if (i % 20 === 0)
            arr.push(<AdvanceProgress key={'a'+i} progress={(i / 2) + 10} />);
        arr.push(<Item key={i} bacon={bacon} />);
    }
    return (
        <div style={{ padding: '10px' }}>
            <Info />
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1>A long list of images</h1>
                {arr}
            </div>
        </div>
    );
};