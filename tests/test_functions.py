# このファイルは test_functions.py として保存します
# pytestを使用したテストファイル

from test_script import add, multiply

def test_add():
    """加算関数のテスト"""
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(-1, -1) == -2

def test_multiply():
    """掛け算関数のテスト"""
    assert multiply(1, 2) == 2
    assert multiply(-1, 1) == -1
    assert multiply(-1, -1) == 1

