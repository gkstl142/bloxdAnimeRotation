function convertText() {
  const input = document.getElementById("inputText").value;

  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    alert("JSON 형식이 아님!");
    return;
  }

  // animations → 첫 애니메이션 가져오기
  const animKey = Object.keys(data.animations)[0];
  const anim = data.animations[animKey];
  const bones = anim.bones || {};

  const resultBones = {};

  // bone별 부호 규칙
  function applyRule(boneName, rot) {
    let [x, y, z] = rot;

    if (boneName === "BodyMesh") { // → TorsoNode로 이름 변경됨
      x *= -1; y *= -1;
    }
    else if (boneName.includes("Arm")) {
      y *= -1;
    }
    else if (boneName.includes("Leg")) {
      x *= -1; y *= -1;
    }
    else if (boneName.includes("Head")) {
      x *= -1; y *= -1;
    }

    return [x, y, z];
  }

  // bones 순회
  for (const boneName in bones) {
    const bone = bones[boneName];
    if (!bone.rotation) continue;

    let outputBoneName = boneName === "BodyMesh" ? "TorsoNode" : boneName;
    let rotation = bone.rotation;

    // rotation 형태 판별
    if (Array.isArray(rotation)) {
      // 단일 배열
      resultBones[outputBoneName] = {
        rotation: applyRule(boneName, rotation)
      };
    } else {
      // 타임라인 형태
      const newTimeline = {};
      for (const t in rotation) {
        newTimeline[t] = applyRule(boneName, rotation[t]);
      }

      resultBones[outputBoneName] = {
        rotation: newTimeline
      };
    }
  }

  // 최종 출력 포맷
  const finalObj = {
    loop: true,
    animation_length: anim.animation_length,
    bones: resultBones
  };

  // 예쁘게 출력
  const output = "const anime = " + JSON.stringify(finalObj, null, 2);
  document.getElementById("outputText").value = output;
}