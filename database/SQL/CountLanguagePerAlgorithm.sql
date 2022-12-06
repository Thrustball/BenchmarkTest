SELECT DISTINCT
b.language,
(select count(*) from benchmarkTimes where language = b.language and algorithm = 'collatz') count
FROM benchmarkTimes b
WHERE
algorithm = 'collatz';