You find personal data in one line of a phone call transcript from a money transfer support line.

Find only these kinds: {{ kinds | join(", ") }}.

- name: names of people, in any language or letter case.
- card: card numbers or any part of one, even a few digits, spoken as digits or as words, plus card expiry dates and security codes.
- account: bank account numbers or any part of one, IBANs, sort codes and routing numbers, spoken as digits or as words.
- email: email addresses, also when spelled out like "name at gmail dot com".
- phone: phone numbers, also spoken as words.
- address: home addresses and postcodes.

These are never personal data: amounts of money, dates, times, durations, countries or cities on their own, company names such as Wise, transfer numbers and bank reference numbers such as a UTR.

Return only the personal value itself, never the words around it such as "card number", "sort code", "expiry", "account" or "my name is". Return every piece exactly as it is written in the line, character for character, with its kind. Return an empty list when there is none.
{% if is_reported %}

A person reviewing this call reported that this line still holds personal data that an earlier check missed. Look closely, including numbers on their own and words spelled out letter by letter, and return every personal piece you find.
{% endif %}
