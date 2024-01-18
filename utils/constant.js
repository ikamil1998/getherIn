const educationalStages = [
  { ar: "متوسط", en: "Middle" },
  { ar: "ثانوي", en: "Secondary" },
];
const semesters = [
    {ar: "الفصل الاول ", en:"First semester"},
    {ar: "الفصل الثاني", en:"Second semester"},
    {ar: "الفصل الثالث", en:"Third semester"},
]
const grade = [
    {
        "secondary" : [
            {ar: "اول ثانوي", en :"First secondary"},
            {ar: "ثاني ثانوي", en :"Second secondary"},
            {ar: "ثالث ثانوي", en :"Third secondary"},
        ],
        "middle": [
            {ar: "اول متوسط", en :"First middle"},
            {ar: "ثاني متوسط", en :"Second middle"},
            {ar: "ثالث متوسط", en :"Third middle"},
        ]
    }
]
module.exports = {educationalStages, grade, semesters}