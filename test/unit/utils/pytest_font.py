from swanboard.utils.font import *
import pytest
import time


class TestGenerateColor:

    def test_generate_color(self):
        # 测试边界情况
        assert generate_color(1) == (COLOR_LIST["light"][0], COLOR_LIST["dark"][0])
        assert generate_color(16) == (COLOR_LIST["light"][15], COLOR_LIST["dark"][15])
        # 测试循环情况
        assert generate_color(17) == (COLOR_LIST["light"][0], COLOR_LIST["dark"][0])
        assert generate_color(32) == (COLOR_LIST["light"][15], COLOR_LIST["dark"][15])
        # 测试其他任意数字
        assert generate_color(5) == (COLOR_LIST["light"][4], COLOR_LIST["dark"][4])
        assert generate_color(20) == (COLOR_LIST["light"][3], COLOR_LIST["dark"][3])


class TestFont:
    def test_loading(self):
        def mock_function(duration):
            time.sleep(duration)
            return "done"

        # 检查正常情况
        result = FONT.loading("Loading...", mock_function, (0.5,), interval=0.1)
        assert result == "done"

        # 检查异常情况
        with pytest.raises(Exception):
            FONT.loading("Loading...", mock_function, ("not a number",), interval=0.1)

    def test_swanlab(self):
        assert FONT.swanlab("Hello") == "\033[1m\033[34mswanlab\033[0m\033[0m: Hello"
        assert FONT.swanlab("Hello", "green") == "\033[1m\033[32mswanlab\033[0m\033[0m: Hello"

    def test_bold(self):
        assert FONT.bold("bold text") == "\033[1mbold text\033[0m"

    def test_default(self):
        assert FONT.default("default text") == "\033[39mdefault text\033[0m"

    def test_blue(self):
        assert FONT.blue("blue text") == "\033[34mblue text\033[0m"

    def test_grey(self):
        assert FONT.grey("grey text") == "\033[90mgrey text\033[0m"

    def test_underline(self):
        assert FONT.underline("underline text") == "\033[4munderline text\033[0m"

    def test_green(self):
        assert FONT.green("green text") == "\033[32mgreen text\033[0m"

    def test_dark_green(self):
        assert FONT.dark_green("dark green text") == "\033[38;5;22mdark green text\033[0m"

    def test_dark_gray(self):
        assert FONT.dark_gray("dark gray text") == "\033[38;5;236mdark gray text\033[0m"

    def test_yellow(self):
        assert FONT.yellow("yellow text") == "\033[33myellow text\033[0m"

    def test_red(self):
        assert FONT.red("red text") == "\033[31mred text\033[0m"

    def test_magenta(self):
        assert FONT.magenta("magenta text") == "\033[35mmagenta text\033[0m"

    def test_clear(self):
        colored_string = "\033[34mblue text\033[0m"
        assert FONT.clear(colored_string) == "blue text"
