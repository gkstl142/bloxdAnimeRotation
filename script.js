function negateAxes(name, rot) {
   const r = [...rot];

   if (name === "BodyMesh") {
      r[0] *= -1;
      r[1] *= -1;
      return r;
   }
   if (name.includes("Arm")) {
      r[1] *= -1;
      return r;
   }
   if (name.includes("Leg")) {
      r[0] *= -1;
      r[1] *= -1;
      return r;
   }
   if (name.includes("Head")) {
      r[0] *= -1;
      r[1] *= -1;
      return r;
   }

   return r;
}

function stringifyCompactArrays(obj) {
   let json = JSON.stringify(obj, null, 2);

   // [x, y, z] 형태만 한 줄로 압축
   json = json.replace(
      /\[\s*([^\[\]]*?)\s*\]/g,
      (match, inside) => {
         const cleaned = inside
            .split(",")
            .map(s => s.trim())
            .join(", ");
         return `[${cleaned}]`;
      }
   );

   return json;
}

function convertText() {
   const input = document.getElementById("inputText").value;

   let json;
   try {
      json = JSON.parse(input);
   } catch (e) {
      alert("JSON 형식이 아님!");
      return;
   }

   const animKey = Object.keys(json.animations)[0];
   const anim = json.animations[animKey];
   const bones = anim.bones || {};

   const outBones = {};

   for (const boneName in bones) {
      const outputBoneName = boneName === "BodyMesh" ? "TorsoNode" : boneName;
      const rotation = bones[boneName].rotation;

      if (Array.isArray(rotation)) {
         outBones[outputBoneName] = {
            rotation: negateAxes(boneName, rotation)
         };
      } else {
         const newRotation = {};
         for (const t in rotation) {
            newRotation[t] = negateAxes(boneName, rotation[t]);
         }
         outBones[outputBoneName] = {
            rotation: newRotation
         };
      }
   }

   const result = {
      loop: true,
      animation_length: anim.animation_length,
      bones: outBones
   };

   document.getElementById("outputText").value =
      "const anime = " + stringifyCompactArrays(result);
}

async function copyText() {
   const text = document.getElementById("outputText").value;

   try {
      await navigator.clipboard.writeText(text);
      alert("복사 완료!");
   } catch (e) {
      alert("복사 실패");
   }
}