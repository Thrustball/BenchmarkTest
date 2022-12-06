SELECT uuid, language, algorithm, runs, iterations, average, parameter FROM benchmarkTimes
WHERE algorithm='nbody'
AND uuid != "2afdc5e945081d77fb5ebde2ec8e9b4fe0261e1543a63a52e815860f0c72b46d"
AND parameter = 1000
And runs = 5
ORDER BY language;