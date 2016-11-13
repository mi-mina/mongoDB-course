use students;
db.grades.drop();
for (i = 0; i < 10000; i++) {
    for (j = 0; j < 4; j++) {
	assess = ['exam', 'quiz', 'homework', 'homework'];
	record = {'student_id':i, 'type':assess[j], 'score':Math.random()*100};
	db.grades.insert(record);
    }
}

// Este código es para correrlo en el terminal
