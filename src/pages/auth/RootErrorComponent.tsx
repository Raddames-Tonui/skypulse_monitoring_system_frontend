
function RootErrorComponent({ error }: { error: unknown }) {
    console.error(error);
    return (
        <div style={{ padding: 40 }}>
            <h1>Something went wrong!</h1>
            <pre>{String(error)}</pre>
        </div>
    );
}


export default RootErrorComponent