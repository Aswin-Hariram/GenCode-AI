import os
import shutil
import subprocess
import tempfile
from typing import List, Dict, Tuple

from services.firebase_service import FirebaseService


class GitHubService:
    @staticmethod
    def _clone_repo(repo_url: str, temp_dir: str) -> None:
        """Clones the repository into the temporary directory."""
        subprocess.run(["git", "clone", repo_url, temp_dir], check=True)

    @staticmethod
    def _get_topic_directories(temp_dir: str) -> List[str]:
        """Gets a list of directories from the cloned repository, which represent the topics."""
        return [
            name
            for name in os.listdir(temp_dir)
            if os.path.isdir(os.path.join(temp_dir, name)) and not name.startswith(".")
        ]

    @classmethod
    def get_topics_from_repo(cls, repo_url: str) -> List[str]:
        """
        Clones a GitHub repository and returns a list of topic directories.
        """
        with tempfile.TemporaryDirectory() as temp_dir:
            cls._clone_repo(repo_url, temp_dir)
            topic_names = cls._get_topic_directories(temp_dir)
            return topic_names

    @classmethod
    def load_topics_from_github(cls, repo_url: str) -> Tuple[int, int]:
        """
        Clones a GitHub repository, extracts topics from the directory structure,
        and adds them to Firebase.

        Args:
            repo_url: The URL of the GitHub repository.

        Returns:
            A tuple containing the number of topics added and the number of topics that already existed.
        """
        with tempfile.TemporaryDirectory() as temp_dir:
            cls._clone_repo(repo_url, temp_dir)
            topic_names = cls._get_topic_directories(temp_dir)

            added_count = 0
            existed_count = 0

            for topic_name in topic_names:
                topic_data = {
                    "name": topic_name,
                    "category": "Uncategorized",  # Default category
                    "difficulty": "medium",  # Default difficulty
                }
                if FirebaseService.add_topic(topic_data):
                    added_count += 1
                else:
                    existed_count += 1
            
            return added_count, existed_count
