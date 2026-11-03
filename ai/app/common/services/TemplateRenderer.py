from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined


class TemplateRenderer:
    def __init__(self, prompts_folder: Path) -> None:
        self.environment = Environment(
            loader=FileSystemLoader(prompts_folder),
            undefined=StrictUndefined,
            trim_blocks=True,
            lstrip_blocks=True,
            autoescape=False,
        )

    def render(self, template_name: str, **values: object) -> str:
        return self.environment.get_template(template_name).render(**values).strip()
