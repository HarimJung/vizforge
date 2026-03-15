import json
import sys

with open("/Users/harimgemmajung/Documents/vizforge/data/ai-energy/ai-energy.json", "r") as f:
    data = json.load(f)

# Basic structure
if isinstance(data, list):
    print(f"=== 데이터 구조 ===")
    print(f"타입: 배열 (Array of Objects)")
    print(f"행 수: {len(data)}")
    print()

    if len(data) > 0:
        # Keys and types
        sample = data[0]
        print(f"=== 컬럼 정보 ===")
        for key, val in sample.items():
            print(f"  {key}: {type(val).__name__} (예: {repr(val)})")
        print()

        # Check all unique keys across records
        all_keys = set()
        for row in data:
            all_keys.update(row.keys())
        if all_keys != set(sample.keys()):
            print(f"주의: 일부 행에 추가 컬럼 존재: {all_keys - set(sample.keys())}")
            print()

        # Numeric columns - summary stats
        print(f"=== 수치형 컬럼 요약 통계 ===")
        numeric_keys = [k for k, v in sample.items() if isinstance(v, (int, float))]
        for key in numeric_keys:
            values = [row[key] for row in data if key in row and isinstance(row[key], (int, float))]
            if values:
                print(f"  {key}:")
                print(f"    min={min(values)}, max={max(values)}, mean={sum(values)/len(values):.2f}")
                print(f"    count={len(values)}, nulls={len(data)-len(values)}")
        print()

        # Categorical columns - unique values
        print(f"=== 범주형 컬럼 고유값 ===")
        str_keys = [k for k, v in sample.items() if isinstance(v, str)]
        for key in str_keys:
            values = [row[key] for row in data if key in row and isinstance(row[key], str)]
            unique = sorted(set(values))
            if len(unique) <= 20:
                print(f"  {key} ({len(unique)}개): {unique}")
            else:
                print(f"  {key} ({len(unique)}개): {unique[:10]} ... (이하 생략)")
        print()

        # Sample rows
        print(f"=== 샘플 데이터 (첫 3행) ===")
        for i, row in enumerate(data[:3]):
            print(f"  [{i}] {json.dumps(row, ensure_ascii=False)}")
        print()
        print(f"=== 샘플 데이터 (마지막 2행) ===")
        for i, row in enumerate(data[-2:]):
            print(f"  [{len(data)-2+i}] {json.dumps(row, ensure_ascii=False)}")

elif isinstance(data, dict):
    print(f"=== 데이터 구조 ===")
    print(f"타입: 객체 (Dictionary)")
    print(f"최상위 키: {list(data.keys())}")
    for key, val in data.items():
        if isinstance(val, list):
            print(f"  {key}: 배열 ({len(val)}개)")
            if len(val) > 0 and isinstance(val[0], dict):
                print(f"    첫 항목 키: {list(val[0].keys())}")
        elif isinstance(val, dict):
            print(f"  {key}: 객체 (키: {list(val.keys())[:5]}...)")
        else:
            print(f"  {key}: {type(val).__name__} = {repr(val)[:100]}")
