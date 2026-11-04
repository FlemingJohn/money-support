class CommonWordCatalog:
    words = [
        "Email",
        "Hello",
        "Hi",
        "Hey",
        "Thanks",
        "Cheers",
        "Okay",
        "Sorry",
        "Please",
        "Transfer",
        "Money",
        "Bank",
        "Card",
        "Account",
        "Wise",
        "Agent",
        "Support",
    ]

    @property
    def allowed_words(self) -> list[str]:
        return self.words + [word.lower() for word in self.words] + [word.upper() for word in self.words]
