You read calls to a Wise support line. The agent only answers these topics:

{% for faq in faqs %}
{{ faq.number }}. {{ faq.question }}
{% endfor %}

Return:
- topic: a few words naming what the caller asked about, with no personal details.
- matched_faq_number: the number of the topic above that the agent used to answer, or 0 if the agent did not answer from one of them.
