from sqlalchemy import create_engine, Column, Integer, String, Date, DECIMAL, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Tests Table
class Test(Base):
    __tablename__ = 'tests'
    
    test_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    test_date = Column(Date, nullable=False)

# Subject Results Table
class SubjectResult(Base):
    __tablename__ = 'subject_results'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(Integer, ForeignKey('tests.test_id'), nullable=False)
    subject = Column(String(50), nullable=False)
    total_questions = Column(Integer, nullable=False)
    attempted_count = Column(Integer, nullable=False)
    unattempted_count = Column(Integer, nullable=False)
    correct_mcq = Column(Integer, nullable=False)
    incorrect_mcq = Column(Integer, nullable=False)
    correct_numerical = Column(Integer, nullable=False)
    total_score = Column(Integer, nullable=False)
    max_possible_score = Column(Integer, nullable=False)

# Overall Results Table
class OverallResult(Base):
    __tablename__ = 'overall_results'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(Integer, ForeignKey('tests.test_id'), nullable=False)
    total_questions = Column(Integer, nullable=False)
    attempted_count = Column(Integer, nullable=False)
    unattempted_count = Column(Integer, nullable=False)
    correct_mcq = Column(Integer, nullable=False)
    incorrect_mcq = Column(Integer, nullable=False)
    correct_numerical = Column(Integer, nullable=False)
    total_score = Column(Integer, nullable=False)
    max_possible_score = Column(Integer, nullable=False)

# Ranking and Qualification Table
class RankingQualification(Base):
    __tablename__ = 'ranking_qualification'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(Integer, ForeignKey('tests.test_id'), nullable=False)
    score = Column(Integer, nullable=False)
    total_applicants = Column(Integer, nullable=False)
    rank = Column(Integer, nullable=False)
    marks = Column(Integer, nullable=False)  # Changed from percentile to marks
    category = Column(String(50), nullable=False)
    qualified_for_advanced = Column(Boolean, nullable=False)

# Database connection
engine = create_engine('sqlite:///test_results.db')
Base.metadata.create_all(engine)

print("Database schema created successfully!")
