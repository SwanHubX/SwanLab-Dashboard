from swanboard.utils.package import get_package_version
import pkg_resources


class TestGetPackageVersion:

    def test_get_package_version_installed(self, monkeypatch):
        """测试 swanlab 包已安装的情况"""

        def mock_get_distribution(name):
            class MockDistribution:
                version = "1.2.3"

            return MockDistribution()

        monkeypatch.setattr(pkg_resources, "get_distribution", mock_get_distribution)
        assert get_package_version() == "1.2.3"

    def test_get_package_version_not_installed(self, monkeypatch):
        """测试 swanlab 包未安装的情况"""

        def mock_get_distribution(name):
            raise pkg_resources.DistributionNotFound

        monkeypatch.setattr(pkg_resources, "get_distribution", mock_get_distribution)
        assert get_package_version() == "swanlab package is not installed"
