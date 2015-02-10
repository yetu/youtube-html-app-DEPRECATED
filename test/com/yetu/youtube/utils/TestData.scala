package com.yetu.youtube.utils

import play.api.libs.json.{Json, JsValue}

trait TestData {


  val jsonDummyValue: JsValue = Json parse """{"source":"453672727272"}"""


  val fakeValidJWTAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9." +
    "eyJzY29wZSI6ImJhciIsInVzZXJVVUlEIjoic29tZS11c2VyLXN0cmFuZ" +
    "2UtdXVpZCIsImNsaWVudElkIjoiY29tLnlldHUudGVzdC5hcHAuaWQiLC" +
    "JpYXQiOjE0MjI2MzU5MTIsImV4cCI6MTczMzY3NTkxMiwiYXVkIjoidGV" +
    "zdCIsImlzcyI6Imh0dHBzOi8vYXV0aC55ZXR1ZGV2LmNvbSIsInN1YiI6I" +
    "nN1YmplY3Qud2l0aC5kb3RzIn0.kmjhtTnOyYiFu5cMYJ-G1kaPyAspi0z" +
    "68s1tmS-2q8RU3AXjbpSDlAdVyjJohHnVMX08oS15Rg3mZQTk_tSNft4An" +
    "DKbpLw7x2_HXZmHofbi-9wXhiQjUp8dCdlugUOc6H04t_bOE0Pj8kE3Wg5" +
    "Z2TGrbNoW6jpl_fBloP-ZfxJuppIhLuRyxE6jVOc57x8LOGhNtaWaQmvvK" +
    "8GnHZa1aIOKtyHt1Qm263ZbNRgDKOCPfZOIvrNU_g7-aCYQik8oaFCiD2a" +
    "TA7qK-VXvmYchY9tgAq2wGZ2qjmIdYczbuzDdCH-1lrYW9JGeCKA_gJnMr" +
    "WQRbMrlHZLj0obl0GyHO30M55A4CGLo1VTd-NG2YbxhnEoO8LEOw4XvzSn" +
    "5ISBY1ht5A7mGAx8mdh79Wz1W0WY7N-ZHRsX5G9uowR1GVaBtxpiykwE5yD" +
    "HjmF3FzlJZB3WHjBKHi0I6Vqzl_Wt2EAK72gnlwPPag9eUgyub0Jn96z7_i" +
    "2H7doGSNzMZp8sg-1UQeqeexk55lbk8HocZ-vwonbPtRFw8-Yr34RduS_oL" +
    "JzthOjijjfboGVgMGEiZe8Lij9sGt8OkS690yehokto_U4Gn6MyQ_aSLsqX" +
    "j7NPMDdAv_7VX_HKsuTJEd7_pcT1sNTqtGxwCLsRIYTeLsyepd2yeWxmhhQ" +
    "rLKz3_cm4"
}
