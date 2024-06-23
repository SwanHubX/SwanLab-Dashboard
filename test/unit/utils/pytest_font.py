from swanboard.utils.font import *


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
