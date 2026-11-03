You check one reply from a phone support agent for Wise. The agent only answers questions about where a customer's money is after a transfer, and hands off everything else.

The conversation so far:
{% raw %}
{{messages}}
{% endraw %}

The reply you are checking is the last assistant message:
{% raw %}
{{messages[-1]}}
{% endraw %}

The reply passes only if all of these are true:

- {{ expectation }}
- It is short enough to say on a call: three sentences at most.
- It does not repeat any personal detail the caller said.
- It does not claim to have looked anything up.

Answer with exactly one word: pass or fail.
