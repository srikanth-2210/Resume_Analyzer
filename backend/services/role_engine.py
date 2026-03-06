import json
import os

class RoleEngine:
    def __init__(self, templates_path: str = None):
        if templates_path is None:
            # Get path relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.templates_path = os.path.join(base_dir, "data", "role_templates.json")
        else:
            self.templates_path = templates_path
        self.roles = self._load_templates()

    def _load_templates(self):
        if os.path.exists(self.templates_path):
            with open(self.templates_path, "r") as f:
                return json.load(f)
        print(f"Warning: Role templates not found at {self.templates_path}")
        return {}

    def get_role_details(self, role_name: str):
        return self.roles.get(role_name)

    def list_roles(self):
        return list(self.roles.keys())

    def get_weights(self, role_name: str):
        role = self.get_role_details(role_name)
        if role:
            return role.get("weights", {"skills": 0.33, "experience": 0.33, "tools": 0.34})
        return {"skills": 0.33, "experience": 0.33, "tools": 0.34}
