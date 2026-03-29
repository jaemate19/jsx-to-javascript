// Configuration
const API_BASE_URL = 'api';

console.log(API_BASE_URL);

// State
let lastResponse = "";

// Elements
const userInput   = document.getElementById('user-input');
const convertBtn  = document.getElementById('convert-button');
const clearBtn    = document.getElementById('clear-button');
const sampleBtn   = document.getElementById('sample-button');

const responseDiv = document.getElementById('response');
const copyBtn     = document.getElementById('copy-button');

const charCount   = document.getElementById('char-count');
const tokenCount  = document.getElementById('token-count');

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => 
{
    bindEvents();
    updateCharCount();
});

// 🔗 Event bindings
function bindEvents() 
{
    userInput.addEventListener('input', updateCharCount);
    convertBtn.addEventListener('click', convert);
    clearBtn.addEventListener('click', clearInput);
    sampleBtn.addEventListener('click', loadSample);
    copyBtn.addEventListener('click', copyToClipboard);
}

// 🔢 Character count
function updateCharCount() 
{
    const count = userInput.value.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    convertBtn.disabled = count === 0;
}

// 🔄 Convert function
async function convert() 
{
    const jsx = userInput.value.trim();

    setLoading(true);

    try 
    {
        const response = await fetch(`${API_BASE_URL}/convert.php`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsx })
        });

        const data = await response.json();

        if (!response.ok) 
        {
            throw new Error(data.error || 'Conversion failed');
        }

        lastResponse = data.converted;
        responseDiv.textContent = lastResponse;
        copyBtn.style.display = 'inline-flex';

        if (tokenCount) 
        {
            tokenCount.textContent = `${data.tokens || 0} tokens`;
        }
    } 
    catch (error) 
    {
        console.error(error);
        responseDiv.textContent = `❌ Error: ${error.message}`;
        copyBtn.style.display = 'none';
    } 
    finally 
    {
        setLoading(false);
    }
}

// 🧹 Clear
function clearInput() 
{
    userInput.value = '';
    responseDiv.textContent = '';
    copyBtn.style.display = 'none';
    lastResponse = '';

    updateCharCount();

    if (tokenCount) 
    {
        tokenCount.textContent = '0 tokens';
    }
}

// 📝 Sample
function loadSample() 
{
    userInput.value = `<div className="greeting">
    <h1>Hello, {name}!</h1>
    {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
    ) : (
        <button onClick={handleLogin}>Login</button>
    )}
</div>`;

    updateCharCount();
}

// 📋 Copy
async function copyToClipboard() 
{
    //copyBtn.textContent = "Failed";
    //if (!lastResponse) return;

    try 
    {
        await navigator.clipboard.writeText(lastResponse);
        copyBtn.textContent = "Copied";
        
    } 
    catch 
    {
        copyBtn.textContent = "Failed";
    }
}

// ⏳ Loading state
function setLoading(isLoading) 
{
    convertBtn.disabled = isLoading;

    if (isLoading) 
    {
        responseDiv.innerHTML = '<span class="loading"></span> Converting your JSX...';
    }
}
